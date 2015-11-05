HOMEDIR = $(shell pwd)

test:
	node tests/get-seance-topic-tests.js

start-medium:
	node medium.js

followback:
	node followback.js

tweet-unprompted:
	node tweet-seance.js

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
		jkang/ngram-seance

run-docker-followback:
	docker run -v $(HOMEDIR)/config:/usr/src/app/config \
		jkang/ngram-seance make followback

run-docker-tweet-unprompted:
	docker run -v $(HOMEDIR)/config:/usr/src/app/config \
		jkang/ngram-seance make tweet-unprompted

pushall: push-docker-image
	git push origin master
