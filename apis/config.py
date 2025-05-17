from datetime import timedelta
class Config:
    SECRET_KEY = 'MAV3zvRcG7'
    JWT_SECRET_KEY = 'cdf36175d0579edbf226f843803f7bf2afed2f7b9e09fb582ccfb677b5e71538a8c53372c27810ddca62d0691cfd419f20d7fd9a0e126cc3e1f1c0e92bc44ab1'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
