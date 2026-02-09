# 🗄️ Database Setup & Configuration

Ushort uses MySQL 8.0 to store URL mappings and analytics data.

## 1. Quick Schema Setup

Run the following in your MySQL CLI or Workbench:

```sql
CREATE DATABASE IF NOT EXISTS url_shortener_db;
USE url_shortener_db;

-- Table created automatically by Hibernate on first run (spring.jpa.hibernate.ddl-auto: update)
```

## 2. Configuration (`application.yml`)

Configure your local credentials under the `spring.datasource` section:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/url_shortener_db?createDatabaseIfNotExist=true
    username: YOUR_USERNAME
    password: YOUR_PASSWORD
  jpa:
    hibernate:
      ddl-auto: update # Automatically creates/updates tables
```

## 3. Advanced Features

### Host Identification

By default, Ushort detects the base URL from the incoming request. If you are behind a proxy (like Nginx), ensure your proxy is configured to set the `X-Forwarded-Host` and `X-Forwarded-Proto` headers.

### URL Deduplication

To prevent users from shortening the same URL multiple times:

```yaml
app:
  features:
    deduplicate: true # Set to false to allow duplicate mappings
```

## 4. Troubleshooting

- **Connection Refused**: Ensure MySQL is running on port 3306.
- **Access Denied**: Verify the `username` and `password` in your `application.yml`.
- **Java Version**: Ensure you are using **Java 21**. Use `java -version` to verify.
