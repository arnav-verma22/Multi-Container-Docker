# Multi-Container-Docker

For ElastiCache Serverless, set `REDIS_TLS=true` in the Elastic Beanstalk
environment properties. Configure `REDIS_HOST` with the cache endpoint hostname
and `REDIS_PORT` with its endpoint port. The API and worker both use these
settings. For local development with the Compose Redis service, leave
`REDIS_TLS` unset.

For encrypted and certificate-verified connections to Amazon RDS for
PostgreSQL, set `PGSSL=true` in the Elastic Beanstalk environment properties.
The server image includes AWS's public RDS CA bundle at
`server/rds-global-bundle.pem` and uses it to verify the database certificate.
Set `PGHOST` to the RDS endpoint hostname (not an IP address) so TLS hostname
verification can succeed. Leave `PGSSL` unset for local Compose PostgreSQL.
After testing the application connection, set `rds.force_ssl=1` in the custom
RDS parameter group to require TLS for all database clients.