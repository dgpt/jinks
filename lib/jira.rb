require 'jira-ruby'

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
end
