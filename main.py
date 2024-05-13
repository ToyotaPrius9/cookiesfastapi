import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth
import mysql.connector
import jwt
from fastapi import APIRouter, HTTPException

router = APIRouter()

firebaseConfig = {
  'apiKey': "AIzaSyDE2pb-vCRRhhaaxWEM4CSPG7-ZWEUhTYg",
  'authDomain': "todoappauth-c4cea.firebaseapp.com",
  'projectId': "todoappauth-c4cea",
  'storageBucket': "todoappauth-c4cea.appspot.com",
  'messagingSenderId': "520590416446",
  'appId': "1:520590416446:web:adba88a34f496c99ac4f6f",
  'measurementId': "G-Y9N3JP07RD",
  'databaseURL': ''
}


# FastAPI app initialization
app = FastAPI(
    description="Todo App with User Registration and Todo Management",
    title="Todo App",
    
)

# Firebase initialization
if not firebase_admin._apps:  # Check if Firebase is not initialized
    cred = credentials.Certificate("harmanauthkey.json")
    firebase_admin.initialize_app(cred)

# MySQL connection
mysql_connection = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="",
    database="todousers"
)

# CORS settings
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Pydantic models
class SignUpSchema(BaseModel):
    username: str
    email: str
    password: str

class TodoItem(BaseModel):
    text: str

class TokenData(BaseModel):
    username: str

# JWT Secret Key (should be kept secure)
SECRET_KEY = "key"
ALGORITHM = "HS256"

# Function to create JWT token
def create_token(data: dict) -> str:
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


class LoginSchema(BaseModel):
    email: str
    password: str

# FastAPI dependency to extract and verify JWT token
def get_current_user(token: Optional[str] = Header(None)):
    if token is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# FastAPI endpoints
@app.post('/signup')
async def create_an_account(user_data: SignUpSchema):
    username = user_data.username
    email = user_data.email
    password = user_data.password

    try:
        # Create user in Firebase authentication
        user = auth.create_user(
            email=email,
            password=password,
            display_name=username
        )

        # Save user details to MySQL 
        cursor = mysql_connection.cursor()
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, password)
        )
        mysql_connection.commit()
        cursor.close()

        return JSONResponse(
            content={"message": "User registered successfully"},
            status_code=201
        )
    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=400,
            detail=f"Account already created for the email {email}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to register user: {str(e)}"
        )

@app.post('/login')
async def login(login_data: LoginSchema):
    email = login_data.email
    password = login_data.password

    try:
        # Verify user credentials with Firebase Authentication
        user = auth.get_user_by_email(email)

        # Firebase authentication successful, generate JWT token
        token_data = {"username": user.display_name}
        token = create_token(token_data)

        return JSONResponse(
            content={"message": "Login successful", "token": token},
            status_code=200
        )

    except auth.UserNotFoundError:
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/google-login")
async def google_login(id_token: str):
    try:
        # Verify Google ID token
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token['uid']
        
        # Retrieve user information (optional)
        user = auth.get_user(user_id)

        # Generate a JWT token
        token_data = {"user_id": user_id}  # You can include more data here if needed
        token = create_token(token_data)

        return {"message": "Google login successful", "token": token}

    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=400, detail="Invalid ID token")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google login failed: {str(e)}")


@app.post('/add_task/{user_id}')
async def add_task(user_id: int, todo_item: TodoItem, token_data: TokenData = Depends(get_current_user)):
    text = todo_item.text

    try:
        # Save todo item to `todo_items` table (assuming user_id is validated)
        cursor = mysql_connection.cursor()
        cursor.execute(
            "INSERT INTO todo_items (user_id, text) VALUES (%s, %s)",
            (user_id, text)
        )
        mysql_connection.commit()
        cursor.close()

        return JSONResponse(
            content={"message": "Todo item added successfully"},
            status_code=201
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to add todo item: {str(e)}"
        )


# FastAPI dependency to extract and verify JWT token
def get_current_user(token: Optional[str] = Header(None)):
    if token is None:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        # Verify and decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("username")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username

    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# FastAPI endpoint to fetch user details using token
@app.get('/user')
async def get_user_data(username: str = Depends(get_current_user)):
    try:
        cursor = mysql_connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user_data = cursor.fetchone()
        cursor.close()

        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        return JSONResponse(content={"username": user_data['username']}, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user data: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
