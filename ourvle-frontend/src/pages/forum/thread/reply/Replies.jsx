import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  ListGroup,
  Button,
  Collapse,
  Alert,
  Form,
} from "react-bootstrap";
import axios from "axios";

const ThreadReplies = () => {
  const { threadId } = useParams();
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openReplies, setOpenReplies] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [showTopLevelInput, setShowTopLevelInput] = useState(false);

  const threadTitle = localStorage.getItem("threadTitle");
  const threadPost = localStorage.getItem("threadPost");

  const fetchReplies = async () => {
    try {
      const response = await axios.get(`/api/threads/${threadId}/replies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReplies(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching replies");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReplies();
  }, [threadId]);

  const toggleReplyCollapse = (replyId) => {
    setOpenReplies((prevState) => ({
      ...prevState,
      [replyId]: !prevState[replyId],
    }));
  };

  const handleReplyChange = (replyId, value) => {
    setReplyInputs((prev) => ({
      ...prev,
      [replyId]: value,
    }));
  };

  const handleReplySubmit = async (replyToId) => {
    const replyText = replyInputs[replyToId || "root"]?.trim();
    if (!replyText) return;

    try {
      const response = await axios.post(
        `/api/threads/${threadId}/replies`,
        {
          reply: replyText,
          reply_to: replyToId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setReplies([...replies, response.data]);
      setReplyInputs((prev) => ({ ...prev, [replyToId || "root"]: "" }));
      if (!replyToId) setShowTopLevelInput(false);
      fetchReplies();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding reply");
    }
  };

  const hasNestedReplies = (parentReplyId) => {
    return replies.some((reply) => reply.ReplyTo === parentReplyId);
  };

  const renderNestedReplies = (parentReplyId) => {
    return replies
      .filter((reply) => reply.ReplyTo === parentReplyId)
      .map((nestedReply) => (
        <div key={nestedReply.ReplyID} style={{ marginLeft: "20px" }}>
          <ListGroup.Item>
            <h5>{nestedReply.UserName}</h5>
            <p>{nestedReply.Reply}</p>
            {hasNestedReplies(nestedReply.ReplyID) && (
              <Button
                variant="link"
                onClick={() => toggleReplyCollapse(nestedReply.ReplyID)}
              >
                {openReplies[nestedReply.ReplyID]
                  ? "Hide replies"
                  : "Show replies"}
              </Button>
            )}
            <Collapse in={openReplies[nestedReply.ReplyID]}>
              <div>{renderNestedReplies(nestedReply.ReplyID)}</div>
            </Collapse>

            <Form.Control
              as="textarea"
              rows={2}
              value={replyInputs[nestedReply.ReplyID] || ""}
              onChange={(e) =>
                handleReplyChange(nestedReply.ReplyID, e.target.value)
              }
              placeholder="Write your reply..."
              className="mt-3"
            />
            <Button
              variant="primary"
              className="mt-2"
              disabled={!replyInputs[nestedReply.ReplyID]?.trim()}
              onClick={() => handleReplySubmit(nestedReply.ReplyID)}
            >
              Submit Reply
            </Button>
          </ListGroup.Item>
        </div>
      ));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <Card className="mb-4 shadow-lg">
        <Card.Header as="h3" className="text-center bg-primary text-white">
          {threadTitle}
        </Card.Header>
        <Card.Body>
          <Card.Text>{threadPost}</Card.Text>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          {replies.length === 0 ? (
            <>
              <p>No replies yet. Be the first to reply!</p>
              <Form.Control
                as="textarea"
                rows={2}
                value={replyInputs["root"] || ""}
                onChange={(e) => handleReplyChange("root", e.target.value)}
                placeholder="Write your reply..."
                className="mt-3"
              />
              <Button
                variant="primary"
                className="mt-2"
                disabled={!replyInputs["root"]?.trim()}
                onClick={() => handleReplySubmit(null)}
              >
                Start Thread
              </Button>
            </>
          ) : (
            <>
              <Button
                className="mb-3"
                onClick={() => setShowTopLevelInput((prev) => !prev)}
              >
                {showTopLevelInput ? "Cancel" : "Reply To Thread"}
              </Button>

              {showTopLevelInput && (
                <>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="mb-2"
                    placeholder="Write your reply..."
                    value={replyInputs["root"] || ""}
                    onChange={(e) => handleReplyChange("root", e.target.value)}
                  />
                  <Button
                    className="mb-4"
                    onClick={() => handleReplySubmit(null)}
                    disabled={!replyInputs["root"]?.trim()}
                  >
                    Submit
                  </Button>
                </>
              )}

              <ListGroup variant="flush">
                {replies
                  .filter((reply) => reply.ReplyTo === null)
                  .map((reply) => (
                    <ListGroup.Item
                      key={reply.ReplyID}
                      className="border-bottom"
                    >
                      <h5>{reply.UserName}</h5>
                      <p>{reply.Reply}</p>
                      {hasNestedReplies(reply.ReplyID) && (
                        <Button
                          variant="link"
                          onClick={() => toggleReplyCollapse(reply.ReplyID)}
                        >
                          {openReplies[reply.ReplyID]
                            ? "Hide replies"
                            : "Show replies"}
                        </Button>
                      )}
                      <Collapse in={openReplies[reply.ReplyID]}>
                        <div>{renderNestedReplies(reply.ReplyID)}</div>
                      </Collapse>

                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={replyInputs[reply.ReplyID] || ""}
                        onChange={(e) =>
                          handleReplyChange(reply.ReplyID, e.target.value)
                        }
                        placeholder="Write your reply..."
                        className="mt-3"
                      />
                      <Button
                        variant="primary"
                        className="mt-2"
                        disabled={!replyInputs[reply.ReplyID]?.trim()}
                        onClick={() => handleReplySubmit(reply.ReplyID)}
                      >
                        Reply
                      </Button>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ThreadReplies;
