DOCKER = docker
DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_UP = $(DOCKER_COMPOSE) up -d
DOCKER_IMAGES = $(shell docker images -q)
DOCKER_CONTAINERS = $(shell docker ps -a -q)
DOCKER_VOLUMES = $(shell docker volume ls)

docker-up: ## Start docker container
	$(DOCKER_COMPOSE_UP)
.PHONY: docker-up

docker-img: ## List all images
	docker images -a
.PHONY: docker-img

docker-ps: ## List all containers
	docker ps
.PHONY: docker-ps

docker-rm: ## Remove all containers
ifneq ($(strip $(DOCKER_CONTAINERS)),)
	docker rm $(DOCKER_CONTAINERS) -f
endif
.PHONY: docker-rm

docker-rmi: ## Remove all images
ifneq ($(strip $(DOCKER_IMAGES)),)
	docker rmi $(DOCKER_IMAGES) -f
endif
.PHONY: docker-rmi

docker-rmv: ## Remove all volumes
ifneq ($(strip $(DOCKER_VOLUMES)),)
	docker volume rm $(DOCKER_VOLUMES) -f
endif
.PHONY: docker-rmv

docker-exec: ## Run a bash shell in a container
	docker exec -it container_docker_backend bash
.PHONY: docker-exec

docker-start:
	sudo systemctl start docker
.PHONY: docker-start

docker-clean: docker-rm docker-rmi docker-rmv
.PHONY: docker-clean

pnpm-install:
	pnpm install
.PHONY: pnpm-install

pnpm-store-prune:
	pnpm store prune
.PHONY: pnpm-store-prune

docker-builder-prune:
	docker builder prune
.PHONY:docker-builder-prune

up: docker-up docker-img docker-ps
.PHONY: up

clean: docker-rm docker-rmi docker-rmv
.PHONY: clean

db-fresh: ## Reset database with fresh migrations, Typesense index, test user, and seeded data
	node ace migration:fresh
	node ace magnify:flush ./app/models/recipe.ts
	node ace magnify:flush ./app/models/tag.ts
	node ace magnify:flush ./app/models/meal_time.ts
	node ace magnify:flush ./app/models/recipe_meal_time.ts
	node ace magnify:flush ./app/models/recipe_tag.ts
	node ace create:test-user
	node ace db:seed
.PHONY: reset-db

