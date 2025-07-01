# Auth Service

Microservice for authentication and authorization in the Food Delivery system.

## 🚀 Features

- User registration and login
- JWT Token authentication
- Role and permission management
- Password change and reset functionality
- Authentication middleware for other services
- RabbitMQ integration for event-driven architecture

## 📁 Project Structure

```
auth-service/
├── src/
│   ├── config/           # Application configuration
│   ├── middleware/       # Middleware handlers
│   │   └── logging.middleware
│   ├── payload/          # DTO and validation schemas
│   │   └── jwt.payloads
│   ├── dto/              # Data Transfer Objects
│   │   ├── change-password.dto
│   │   ├── forgot-password.dto
│   │   ├── register.dto
│   │   ├── reset-password.dto
│   │   └── signin.dto
│   │   repository/   # Repository patterns
│   │   └── auth.repository
│   ├── entity/           # Database entities
│   │   └── auth.entity
│   ├── shared/           # Shared utilities
│   │   ├── database/     # Database configuration
│   │   └── queue/        # RabbitMQ configuration
│   ├── app.modules
│   ├── app.service
│   └── main
```

## 🛠️ Installation

### System Requirements

- Node.js >= 18.x
- MySQL >= 5.7
- RabbitMQ

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Auth Service Configuration
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=5001

# Database Configuration
DB_USERNAME=username
DB_PASSWORD=password
DB_NAME=auth
DB_HOST=localhost
DB_PORT=3306

# RabbitMQ Configuration
RABBITMQ_URL=amqp://user:pass@localhost:5672

# Application Configuration
PORT=5001
JWT_EXPIRES=1d
JWT_SECRET=your_secret
```

### Database Setup

Ensure MySQL is running and create the database:

```sql
CREATE DATABASE auth;
```

### RabbitMQ Setup

```bash
# Using Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Or install locally
# Reference: https://www.rabbitmq.com/download.html
```

## 🏃‍♂️ Running the Application

### Install Dependencies

```bash
cd services/auth-service
npm install
```

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm start
```

## 🔧 Configuration

### Database

The service uses MySQL as the primary database. Configure connection in `.env`:

- `DB_HOST`: Database server address
- `DB_PORT`: Database port (default 3306)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

### JWT Configuration

- `JWT_SECRET`: Secret key for JWT token encryption
- `JWT_EXPIRES`: Token expiration time (e.g., 1d, 7d, 24h)

### RabbitMQ

Service integrates with RabbitMQ for event messaging:

- `RABBITMQ_URL`: RabbitMQ connection URL

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens have expiration time
- Strict input validation
- Rate limiting to prevent brute force attacks
- CORS configuration

## 📊 Monitoring & Logging

The service includes logging middleware for tracking:

- Request/Response logs
- Error tracking
- Performance monitoring

### 📬 API Documentation

```bash
http://localhost:5001/api
```

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

If you have any issues or questions, please create an issue on the GitHub repository.
