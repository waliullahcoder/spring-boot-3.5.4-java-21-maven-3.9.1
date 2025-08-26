
========Main Project Directory structure=====================
accounting-java-react/
├─ pom.xml                      # Parent (BOM + dependencyManagement)
├─ README.md
├─ .editorconfig
├─ .gitignore
├─ docker/
│  ├─ postgres/
│  │  └─ docker-compose.yml
│  └─ keycloak/                 # (optional if you prefer external IdP)
│     └─ docker-compose.yml
├─ scripts/
│  ├─ init-db.sql
│  └─ run-local.sh
├─ config/                      # shared configs, SQL, JSON schemas
│  └─ application-sample.yml
├─ modules/
│  ├─ app/                      # Boot app (thin, wires everything)
│  ├─ api/                      # REST controllers + DTOs + OpenAPI
│  ├─ security/                 # AuthN/Z, JWT, password hashing
│  ├─ core/                     # Domain model, services (pure business)
│  ├─ persistence/              # JPA repositories, entity mappings
│  ├─ reporting/                # PDF/Excel/BI adapters
│  ├─ integration/              # Messaging (Kafka/Rabbit), external APIs
│  ├─ batch/                    # Spring Batch jobs (posting, statements)
│  ├─ migration/                # Flyway/Liquibase migrations
│  └─ common/                   # Shared utils: errors, mapping, auditing
└─ tests/
├─ e2e/                      # Testcontainers-based end-to-end tests
└─ perf/                     # JMH or Gatling (if used)


I’ll restructure the Login, Registration, Profile Update, Logout APIs (Spring Boot 3.5.4, Java 21, Maven 3.9.1) to fit neatly into your provided modular directory layout.
==============================================================================
accounting-java-react/
├─ pom.xml
├─ config/
│  └─ application-sample.yml
├─ modules/
│  ├─ app/
│  │  └─ src/main/java/com/example/app/Application.java
│  │
│  ├─ api/
│  │  └─ src/main/java/com/example/api/controller/AuthController.java
│  │
│  ├─ security/
│  │  └─ src/main/java/com/example/security/
│  │       ├─ config/SecurityConfig.java
│  │       ├─ service/CustomUserDetailsService.java
│  │       ├─ jwt/JwtUtil.java
│  │       ├─ jwt/JwtFilter.java
│  │
│  ├─ core/
│  │  └─ src/main/java/com/example/core/service/UserService.java
│  │
│  ├─ persistence/
│  │  └─ src/main/java/com/example/persistence/
│  │       ├─ entity/User.java
│  │       └─ repository/UserRepository.java
│  │
│  └─ common/
│      └─ src/main/java/com/example/common/dto/
│           ├─ LoginRequest.java
│           ├─ RegisterRequest.java
│           └─ UserProfileDto.java
└─ tests/
└─ e2e/



# from project root
mvn -v         # Maven 3.9.1+
mvn clean install
mvn -pl modules/app -am spring-boot:run

# for migration
mvn spring-boot:run

APIs:

POST /api/auth/register

POST /api/auth/login

PUT /api/auth/profile (needs Authorization: Bearer <token>)

POST /api/auth/logout