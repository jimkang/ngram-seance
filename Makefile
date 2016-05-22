HOMEDIR = $(shell pwd)
SMUSER = noderunner
PRIVUSER = root
SERVER = sprigot-droplet
SSHCMD = ssh $(SMUSER)@$(SERVER)
PROJECTNAME = ngram-seance
APPDIR = /var/www/$(PROJECTNAME)

pushall: sync  set-permissions restart-remote
	git push origin master

sync:
	rsync -a $(HOMEDIR) $(SMUSER)@$(SERVER):/var/www/ --exclude node_modules/ --exclude data/
	ssh $(SMUSER)@$(SERVER) "cd /var/www/$(PROJECTNAME) && npm install"

set-permissions:
	$(SSHCMD) "chmod +x $(APPDIR)/medium.js && \
	chmod 777 -R $(APPDIR)/data/seance-chronicler.db"

update-remote: sync set-permissions restart-remote

# You need a user with privileges to write to /etc/systemd and to run systemctl for 
# these targets.
restart-remote:
	ssh $(PRIVUSER)@$(SERVER) "service $(PROJECTNAME) restart"

install-service:
	ssh $(PRIVUSER)@$(SERVER) "cp $(APPDIR)/$(PROJECTNAME).service /etc/systemd/system && \
	systemctl enable $(PROJECTNAME)"

test:
	node tests/get-seance-topic-tests.js

followback:
	node followback.js

tweet-unprompted:
	node tweet-seance.js
