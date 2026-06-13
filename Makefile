.DEFAULT_GOAL := help

COMPOSE      ?= docker compose
COMPOSE_DEV  := $(COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml
APP          := app

.PHONY: help
help: ## Lista los comandos disponibles
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ---------- bootstrapping ----------

.PHONY: env
env: ## Copia env.development.template a .env y genera secrets locales si están vacíos
	@if [ ! -f .env ]; then cp env.development.template .env && echo "✔ .env creado desde el template"; else echo "✔ .env ya existe"; fi
	@for var in JWT_SECRET CRIPTO_SECRET_KEY CRYPTO_SECRET_DATA; do \
		if grep -qE "^$$var=\"\"$$" .env; then \
			val=$$(openssl rand -hex 32); \
			tmp=$$(mktemp); \
			awk -v k="$$var" -v v="$$val" '$$0 ~ "^"k"=\"\"$$" {print k"=\""v"\""; next} {print}' .env > $$tmp && mv $$tmp .env; \
			echo "✔ $$var generado"; \
		fi; \
	done

.PHONY: build
build: ## Construye la imagen de la app
	$(COMPOSE) build $(APP)

.PHONY: rebuild
rebuild: ## Reconstruye la imagen sin cache
	$(COMPOSE) build --no-cache $(APP)

# ---------- runtime ----------

.PHONY: up
up: env ## Levanta el stack completo en modo producción (mongo + redis + app)
	$(COMPOSE) up -d

.PHONY: dev
dev: env ## Levanta mongo + redis + app con hot reload (tsc-watch)
	$(COMPOSE_DEV) up

.PHONY: dev-detached
dev-detached: env ## Igual que dev pero en segundo plano
	$(COMPOSE_DEV) up -d

.PHONY: down
down: ## Detiene los contenedores (conserva volúmenes)
	$(COMPOSE) down

.PHONY: stop
stop: ## Pausa los contenedores sin eliminarlos
	$(COMPOSE) stop

.PHONY: restart
restart: ## Reinicia el servicio app
	$(COMPOSE) restart $(APP)

.PHONY: ps
ps: ## Lista el estado de los contenedores
	$(COMPOSE) ps

# ---------- observability ----------

.PHONY: logs
logs: ## Tail logs del servicio app
	$(COMPOSE) logs -f $(APP)

.PHONY: logs-all
logs-all: ## Tail logs de todos los servicios
	$(COMPOSE) logs -f

# ---------- shells ----------

.PHONY: shell
shell: ## Abre shell sh dentro del contenedor app
	$(COMPOSE) exec $(APP) sh

.PHONY: mongo-shell
mongo-shell: ## Abre mongosh dentro del contenedor mongo
	$(COMPOSE) exec mongo mongosh

.PHONY: redis-cli
redis-cli: ## Abre redis-cli dentro del contenedor redis
	$(COMPOSE) exec redis redis-cli

# ---------- maintenance ----------

.PHONY: install
install: ## Corre pnpm install dentro del contenedor app
	$(COMPOSE) run --rm $(APP) pnpm install

.PHONY: clean
clean: ## Elimina contenedores y volúmenes (¡borra datos!)
	$(COMPOSE) down -v

.PHONY: prune
prune: ## Limpia imágenes huérfanas
	docker image prune -f
