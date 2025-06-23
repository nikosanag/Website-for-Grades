# Database Syncing Service

This service is responsible for synchronizing data between distributed components of the NTUA ECE SAAS 2025 Project. It ensures data consistency and reliability across the platform, using RabbitMQ for messaging.

- Automatically syncs collections across databases
- No public endpoints exposed; operates in the background
- Uses RabbitMQ (ports 5672, 15672)

---

For setup and usage, refer to the main [README](../README.md).
