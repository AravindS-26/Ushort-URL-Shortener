# 🏗️ Ushort Architecture

## System Flow

The system follows a reactive, request-first flow with integrated tracing and monitoring.

```mermaid
graph TD
    Client[User Browser] -->|X-Correlation-ID| Filter[CorrelationIdFilter]
    Filter -->|MDC Context| Controllers[Controllers]

    Controllers -->|UrlController| ShortService[UrlShortenerService]
    Controllers -->|AnalyticsController| AnalyticsService[AnalyticsService]

    ShortService -->|SHA-256| Dedupe[Deduplication Logic]
    ShortService -->|Base62 + Retries| Encoder[Secure Base62Encoder]

    ShortService -->|Analytics Data| MySQL[(MySQL 8.0)]
    AnalyticsService -->|Read Data| MySQL

    Controllers -->|Metrics| Micrometer[Micrometer Registry]
    Micrometer --> Prometheus[/actuator/prometheus]
```

## 1. Traceability & Monitoring

- **Tracing**: Every incoming request is intercepted by `CorrelationIdFilter`, which injects a unique string into the Mapped Diagnostic Context (MDC). This ID is returned in the `X-Correlation-ID` header.
- **Metrics**: `UrlController` uses a `MeterRegistry` to record:
  - `ushort_redirects_total`: Counter for successful/failed redirects.
  - `ushort_redirect_latency`: Timer measuring redirect speed.

## 2. Core Components

### Backend Packages (`com.antigravity.urlshortener`)

- `config/`: Contains `CorrelationIdFilter`, `WebConfig`, and security settings.
- `service/`: Implements the "Hardening" layers (Self-ref checks, deduplication, collision logic).
- `util/`:
  - `Base62Encoder`: Hardened against collisions with random suffix support.
  - `ShortUrlBuilder`: Centralized logic for URI construction and loop prevention.
- `exception/`: Centralized error map with Slf4j structured logging.

### Frontend Layers (`src/`)

- `services/api.js`: Axios instance with a global interceptor that parses user-friendly error messages from status codes (410, 429, etc.).
- `components/common/Toast`: Global notification system.
- `context/ThemeContext`: Persistence layer for the system-wide Dark Mode.

## 3. Data Integrity & Security

- **Collision Retry**: If a generated short code exists, the system automatically retries with a new suffix up to 3 times.
- **Hash Fingerprinting**: URLs can be deduplicated using SHA-256 hashing to ensure a single long URL doesn't consume multiple IDs (configurable).
- **Expiration**: The system automatically serves a `410 Gone` HTML page for links that have passed their `expiresAt` timestamp.
