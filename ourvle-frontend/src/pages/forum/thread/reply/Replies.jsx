import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Button, Collapse, Alert, Form } from 'react-bootstrap';
import axios from 'axios';

const ThreadReplies = () => {
  const { threadId } = useParams(); // Get threadId from URL
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openReplies, setOpenReplies] = useState({}); // To control collapse state of nested replies
  const [newReply, setNewReply] = useState(''); // State to manage new reply input
  const threadTitle = localStorage.getItem('threadTitle'); // Get threadTitle from localStorage
  const threadPost = localStorage.getItem('threadPost'); // Get threadPost from localStorage

  // Fetch replies for the thread when the component is mounted
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await axios.get(`/api/threads/${threadId}/replies`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Use JWT from localStorage
          },
        });
        setReplies(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching replies');
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [threadId]);

  const toggleReplyCollapse = (replyId) => {
    setOpenReplies((prevState) => ({
      ...prevState,
      [replyId]: !prevState[replyId],
    }));
  };

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleReplySubmit = async (reply_to) => {
    try {
      const response = await axios.post(`/api/threads/${threadId}/replies`, {
        reply: newReply,
        reply_to,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Use JWT from localStorage
        },
      });
      // Add the new reply to the state (update replies)
      setReplies([...replies, response.data]);
      setNewReply(''); // Clear the input field after submission
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding reply');
    }
  };

  // Check if a reply has nested replies
  const hasNestedReplies = (parentReplyId) => {
    return replies.some((reply) => reply.ReplyTo === parentReplyId);
  };

  const renderNestedReplies = (parentReplyId) => {
    return replies
      .filter((reply) => reply.ReplyTo === parentReplyId)
      .map((nestedReply) => (
        <div key={nestedReply.ReplyID} style={{ marginLeft: '20px' }}>
          <ListGroup.Item>
            <h5>{nestedReply.UserName}</h5>
            <p>{nestedReply.Reply}</p>
            {hasNestedReplies(nestedReply.ReplyID) && (
              <Button
                variant="link"
                onClick={() => toggleReplyCollapse(nestedReply.ReplyID)}
              >
                {openReplies[nestedReply.ReplyID] ? 'Hide replies' : 'Show replies'}
              </Button>
            )}
            <Collapse in={openReplies[nestedReply.ReplyID]}>
              <div>{renderNestedReplies(nestedReply.ReplyID)}</div>
            </Collapse>

            {/* Add reply form */}
            <Form.Control
              as="textarea"
              rows={2}
              value={newReply}
              onChange={handleReplyChange}
              placeholder="Write your reply..."
              className="mt-3"
            />
            <Button
              variant="primary"
              className="mt-2"
              onClick={() => handleReplySubmit(nestedReply.ReplyID)}
            >
              Submit Reply
            </Button>
          </ListGroup.Item>
        </div>
      ));
  };

  // Render loading state or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <Card className="mb-4 shadow-lg">
        <Card.Header as="h3" className="text-center bg-primary text-white">{threadTitle}</Card.Header>
        <Card.Body>
          <Card.Text>{threadPost}</Card.Text>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          {replies.length === 0 ? (
            <p>No replies yet.</p>
          ) : (
            <ListGroup variant="flush">
              {replies
                .filter((reply) => reply.ReplyTo === null) // Only top-level replies
                .map((reply) => {
                  const nestedReplies = replies.filter(
                    (nestedReply) => nestedReply.ReplyTo === reply.ReplyID
                  );
                  return (
                    <ListGroup.Item key={reply.ReplyID} className="border-bottom">
                      <h5>{reply.UserName}</h5>
                      <p>{reply.Reply}</p>
                      {nestedReplies.length > 0 && (
                        <Button
                          variant="link"
                          onClick={() => toggleReplyCollapse(reply.ReplyID)}
                        >
                          {openReplies[reply.ReplyID] ? 'Hide replies' : 'Show replies'}
                        </Button>
                      )}
                      <Collapse in={openReplies[reply.ReplyID]}>
                        <div>{renderNestedReplies(reply.ReplyID)}</div>
                      </Collapse>

                      {/* Add reply form */}
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={newReply}
                        onChange={handleReplyChange}
                        placeholder="Write your reply..."
                        className="mt-3"
                      />
                      <Button
                        variant="primary"
                        className="mt-2"
                        onClick={() => handleReplySubmit(reply.ReplyID)}
                      >
                        Reply
                      </Button>
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ThreadReplies;
