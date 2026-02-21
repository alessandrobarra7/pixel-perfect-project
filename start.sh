#!/bin/bash
export NODE_ENV=production
export PORT=3002
export DATABASE_URL="postgresql://admin:SYs2knYbY7IkUalbPjYm@localhost:5432/pacs_manus"
export JWT_SECRET="pacs-manus-jwt-secret-2026"
export JWT_EXPIRES_IN="7d"
export ENCRYPTION_KEY="719ddcd0636027154ee3966e3899794f9afdffb480be6d7668dad918f488bb36"
node dist/server.js
