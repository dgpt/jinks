require 'jira-ruby'

# Wrapper for jira-ruby
# https://github.com/sumoheavy/jira-ruby
class Jira
  attr_reader :client


  def initialize
    @client = JIRA::Client.new({
      :site               => 'https://instructure.atlassian.net',
      :context_path       => '',
      :signature_method   => 'RSA-SHA1',
      :rest_base_path     => "/rest/api/2",
      :consumer_key       => ENV["OAUTH_CONSUMER_KEY"],
      :consumer_secret    => ENV["OAUTH_CONSUMER_NAME"],
      :private_key_file   => File.expand_path(ENV["OAUTH_PEM"])
    })

    @client.set_access_token(
      ENV["OAUTH_ACCESS_TOKEN"],
      ENV["OAUTH_ACCESS_SECRET"]
    )

    @client
  end

  def load_issues(jql)
    issues = @client.Issue.jql(jql, fields: Issue::JIRA_FIELDS, max_results: 300)
    issues.each do |issue|
      Issue.update_or_create_from_json!(issue.attrs).tap do |i|
        issue.issuelinks.each do |link|
          i.create_link_from_json!(link.attrs)
        end
      end
    end
  end
end
