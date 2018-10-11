# JINKS
A Jira Link Manager - now YOU can view and update linked dependency trees for Jira!

# Setup
* Get Jira oauth credentials, add them to .env.local (use .env as a guideline)
$ bundle install
$ rake neo4j:install[enterprise-latest]

# Start
$ rake neo4j:start
$ rails s

# Development
Neo4j browser
  localhost:7474/browser/
