# Thread & Butter AWS EC2 Production Deployment Plan

> Status: approved architecture; implementation not started  
> Decision date: 2026-08-22  
> Primary goals: keep the storefront live at low cost, gain practical AWS experience, and create a
> credible production deployment for a software-engineering portfolio

## 1. Context and constraints

Thread & Butter currently has very low expected traffic. The deployment should therefore optimize
for predictable cost, understandable operations, security, recoverability, and resume value rather
than premature horizontal scaling.

The application is a monolith consisting of:

- a React/Vite frontend;
- a Spring Boot 3 application running on Java 21;
- PostgreSQL with Flyway migrations;
- Stripe Checkout and webhooks;
- Cloudinary-hosted product and request media;
- Cloudflare AI integrations;
- transactional email notifications.

Guest checkout remains supported. Customer authentication will run inside Spring Boot using
Spring Security, application-managed users in PostgreSQL, short-lived JWT access cookies, and
rotating refresh sessions. Amazon SES will handle verification and password-reset email.

## 2. Architecture decision

Deploy the containerized monolith to one Amazon EC2 instance in `ca-central-1`. Run PostgreSQL on
the same instance initially, but keep its data on a dedicated encrypted EBS volume. Store nightly
logical backups in a private, versioned S3 bucket.

```text
Internet
   |
Route 53 or Cloudflare DNS
   |
Elastic IP
   |
EC2 t4g.small (2 vCPU, 2 GB RAM)
   |
   +-- Caddy: TLS termination and HTTP -> HTTPS redirect
   +-- Spring Boot: API plus compiled React storefront
   +-- PostgreSQL: private container, dedicated encrypted EBS data volume
   |
   +-- CloudWatch: metrics, logs, and alarms
   +-- S3: encrypted PostgreSQL backups
   +-- SES: transactional email
   +-- SSM Parameter Store: application configuration and secrets

GitHub Actions --OIDC--> AWS IAM --push--> ECR --deploy through--> SSM
```

## 3. Why EC2 now

EC2 is the best current balance because it:

- keeps the site continuously available;
- requires no serverless rewrite;
- costs less than an always-on ECS Fargate, load-balancer, and RDS stack;
- teaches core AWS networking, compute, storage, IAM, monitoring, and deployment concepts;
- supports a normal long-running Spring Boot process and PostgreSQL connection pool;
- preserves a clear migration path to RDS and ECS when real usage requires them.

This is an intentional low-traffic architecture, not a claim of high availability. Its limitations
must be documented and mitigated with tested backups, monitoring, and a recovery procedure.

## 4. Initial AWS resources

Provision the following resources with Terraform:

| Service | Initial use |
|---|---|
| EC2 | One `t4g.small` Graviton instance running the production containers |
| VPC | One VPC and public subnet in `ca-central-1` |
| Security Group | Public `80/443`; no public PostgreSQL; administration through SSM |
| Elastic IP | Stable public address for the storefront |
| EBS | Encrypted root volume and separate encrypted PostgreSQL data volume |
| ECR | Private repository for versioned application images |
| IAM | GitHub OIDC deploy role and least-privilege EC2 instance role |
| Systems Manager | Session Manager, Parameter Store, and deployment commands |
| S3 | Private, encrypted, versioned database-backup bucket |
| CloudWatch | Application logs, instance metrics, disk alarms, and health alarms |
| SES | Authenticated transactional email domain and SMTP/API delivery |
| AWS Budgets | Alerts before the monthly bill exceeds expected thresholds |
| Route 53 | Optional hosted zone if DNS is not kept at Cloudflare |

The database must never accept public inbound connections. EC2 administration should use Systems
Manager Session Manager instead of password-based SSH.

## 5. Production container layout

Use a production Docker Compose definition containing:

1. `proxy`: Caddy, serving HTTPS and forwarding requests to the application;
2. `app`: a multi-stage image that builds React, packages the compiled assets with Spring Boot, and
   runs the Java 21 application;
3. `db`: PostgreSQL with its data directory mounted from the dedicated EBS volume.

Only the proxy publishes host ports. The application and database communicate over a private
Docker network.

Set explicit resource limits and a conservative JVM heap so PostgreSQL and the operating system
retain enough memory. Production images must run as non-root users and must not contain `.env`
files, source credentials, build caches, or local database data.

## 6. CI/CD design

Every deployment from the protected `main` branch should:

1. run backend tests;
2. run frontend type-checking, linting, and the production build;
3. build the ARM64 production container;
4. scan the image and dependencies;
5. authenticate to AWS with GitHub Actions OIDC rather than permanent access keys;
6. push an immutable commit-tagged image to ECR;
7. ask Systems Manager to pull and start the new image on EC2;
8. wait for the application health endpoint;
9. retain the previous image tag and roll back if verification fails.

Do not build the application on the small production instance. CI should build the image so EC2
only has to pull and run it.

## 7. Security baseline

- Enable MFA on the AWS root account and do not use it for everyday work.
- Use least-privilege IAM roles and short-lived OIDC credentials.
- Keep application secrets in SSM Parameter Store or Secrets Manager, never Git or container
  layers.
- Rotate every credential previously exposed in screenshots, terminal output, or Git history.
- Encrypt EBS volumes and the S3 backup bucket.
- Permit only HTTP and HTTPS from the internet.
- Redirect HTTP to HTTPS and use modern TLS settings.
- Keep PostgreSQL and Docker management ports private.
- Apply security updates and rebuild the application image regularly.
- Enable EC2 termination protection and S3 public-access blocking.
- Add CSP and other appropriate HTTP security headers at the application/proxy layer.
- Configure AWS billing alerts before creating long-running resources.

## 8. Database backup and recovery

The initial database is not managed by RDS, so recovery is an explicit operational responsibility.

- Run a nightly `pg_dump` to a temporary protected path.
- Upload the encrypted dump to the private S3 backup bucket with the EC2 instance role.
- Apply lifecycle rules that retain recent daily backups and a smaller number of weekly/monthly
  backups.
- Monitor backup success and alert when no recent backup exists.
- Take EBS snapshots as an additional recovery layer.
- Perform and document a restore test before accepting production orders.
- Keep the EBS database volume independent from the container lifecycle.

## 9. Email and domain

The same domain can serve the site and business email through separate DNS records:

```text
threadandbutter.ca                 website
www.threadandbutter.ca             website alias
hello@threadandbutter.ca           human-operated mailbox
orders@mail.threadandbutter.ca     SES transactional sender
```

SES should send application messages such as order confirmations and authentication codes. A
mailbox provider such as Zoho Mail, Microsoft 365, or Amazon WorkMail should receive and manage
human correspondence. Configure SPF, DKIM, and DMARC for every sending domain or subdomain.

## 10. Expected starting cost

Plan for approximately USD 15-25 per month before tax, depending on EC2 region pricing, EBS size,
IPv4, DNS, logs, and backup usage. SES and S3 should be negligible at the initial volume. The domain,
business mailbox, Cloudinary overages, Cloudflare usage, and Stripe transaction fees are separate.

AWS credits can reduce the early bill, but the production site must use a paid AWS account plan so
resources are not removed when a temporary free plan ends.

Configure budget notifications around USD 10, 20, and 30 during the first months and review Cost
Explorer regularly.

## 11. Services intentionally deferred

### ECS Fargate

ECS is appropriate when the application needs multiple tasks, rolling deployments, task
replacement, horizontal scaling, or multi-Availability-Zone operation. At the initial traffic
level, an always-on Fargate task, Application Load Balancer, and managed database would add fixed
cost without improving the customer experience enough to justify it.

### Lambda

Lambda is appropriate for isolated event-driven jobs, not the complete current monolith. Moving
the whole application would require changes for API Gateway request limits, long-running AI calls,
multipart uploads, Java cold starts, and relational-database connection management.

Possible future Lambda workloads include thumbnail generation, queued email delivery, scheduled
cleanup, and other asynchronous processing.

### RDS

RDS should replace the EC2-hosted PostgreSQL database when order volume, recovery objectives, or
availability requirements justify a managed database. The application already uses PostgreSQL and
Flyway, so the migration should not require a domain-model rewrite.

## 12. Migration triggers

Move PostgreSQL to RDS when any of the following becomes true:

- losing several hours of database availability would materially affect the business;
- manual backup and patch management becomes burdensome;
- the application needs multiple compute instances;
- automated point-in-time recovery is required.

Move the application to ECS when:

- one instance no longer handles peak demand;
- releases require zero-downtime rolling deployments;
- automatic unhealthy-task replacement is required;
- the business needs multi-Availability-Zone compute.

## 13. Resume and portfolio outcomes

The implementation should support accurate statements such as:

> Built and deployed a containerized React, Spring Boot, PostgreSQL, and Stripe e-commerce platform
> on AWS EC2. Provisioned infrastructure with Terraform and automated tested deployments using
> GitHub Actions OIDC, ECR, and Systems Manager.

> Applied least-privilege IAM, encrypted EBS storage, SSM-managed secrets, CloudWatch monitoring,
> SES domain authentication, and tested S3 database backups, with a documented migration path to
> RDS and ECS as availability requirements grow.

The repository README should include an architecture diagram, local-development instructions,
deployment overview, security decisions, test commands, and the reasoning behind the staged
architecture.

## 14. Implementation order

1. Remove generated build artifacts from Git and audit repository history for secrets.
2. Rotate exposed GitHub, Stripe, Cloudinary, Cloudflare, SMTP, and other credentials.
3. Add production frontend-to-Spring packaging and a multi-stage Dockerfile.
4. Add a production Docker Compose definition and Caddy configuration.
5. Add a health endpoint and production configuration profile.
6. Add Terraform for networking, EC2, EBS, IAM, ECR, S3, monitoring, budgets, and DNS.
7. Add GitHub Actions OIDC and the build/deploy/rollback workflow.
8. Add backup, restore, patching, and incident runbooks.
9. Deploy a staging environment and complete checkout, webhook, email, and restore tests.
10. Connect the production domain, configure SES, switch Stripe to live credentials, and complete a
    small real transaction followed by a refund.

## 15. Primary AWS references

- EC2: <https://docs.aws.amazon.com/ec2/>
- Graviton: <https://aws.amazon.com/ec2/graviton/>
- Systems Manager Session Manager:
  <https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html>
- GitHub Actions OIDC with AWS:
  <https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services>
- ECR: <https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html>
- S3 security: <https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html>
- PostgreSQL backup: <https://www.postgresql.org/docs/current/backup-dump.html>
- Amazon SES: <https://docs.aws.amazon.com/ses/latest/dg/Welcome.html>
- AWS Budgets: <https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html>

How to describe it on your resume
Once deployed, a truthful project entry could read:
Built and deployed a full-stack e-commerce platform using React, Spring Boot, PostgreSQL and Stripe. Provisioned AWS infrastructure with Terraform, containerized the application with Docker, automated deployments through GitHub Actions, ECR and Systems Manager, and implemented IAM-based secret management, CloudWatch monitoring and encrypted S3 database backups.

A second bullet could say:
Designed a cost-conscious single-instance architecture for initial traffic with a documented migration path to Amazon ECS and RDS as availability and scaling requirements grow.
