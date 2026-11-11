# Multi-Container-Docker

For ElastiCache Serverless, set `REDIS_TLS=true` in the Elastic Beanstalk
environment properties. Configure `REDIS_HOST` with the cache endpoint hostname
and `REDIS_PORT` with its endpoint port. The API and worker both use these
settings. For local development with the Compose Redis service, leave
`REDIS_TLS` unset.