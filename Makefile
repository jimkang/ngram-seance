HOMEDIR = $(shell pwd)

test:
	node tests/basictests.js

start: start-ngram-seance
	psy start -n ngram-seance -- node yet-another-module.js

stop:
	psy stop ngram-seance || echo "Non-zero return code is OK."

sync-worktree-to-git:
	git --work-tree=$(HOMEDIR) --git-dir=$(GITDIR) checkout -f

npm-install:
	cd $(HOMEDIR)
	npm install
	npm prune

post-receive: sync-worktree-to-git npm-install stop start

stop-docker-machine:
	docker-machine stop dev

start-docker-machine:
	docker-machine start dev

create-docker-machine:
	docker-machine create --driver virtualbox dev

stop-docker-machine:
	docker-machine stop dev

start-docker-machine:
	docker-machine start dev

# connect-to-docker-machine:
	# eval "$(docker-machine env dev)"

build-docker-image:
	docker build -t jkang/ngram-seance .

push-docker-image: build-docker-image
	docker push jkang/ngram-seance

run-docker-image:
	docker run -v $(HOMEDIR)/config:/usr/src/app/config \
		jkang/ngram-seance make run

pushall: push-docker-image
	git push origin master
