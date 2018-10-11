require 'jira'

class IssueService
  def initialize(force_update: true)
    @client = Jira.new.client
    @force_update = force_update
    @jql = []
  end

  def set_epic(key)
    @jql << "\"Epic Link\" = #{key}"
  end

  def set_issues(keys)
    @jql << "key in (#{Array(keys).join(", ")})"
  end

  def set_sprint(sprint)
    #TODO
  end

  def load
    jql = @jql.join(" AND ")
    cache_key = "jql:#{jql}"
    return unless @force_update || Rails.cache.read(cache_key).nil?
    return if @jql.empty?

    issues = @client.Issue.jql(
      jql,
      fields: Issue::JIRA_FIELDS,
      max_results: 300
    )

    Rails.cache.write(cache_key, true, expires_in: 5.minutes)

    issues.each do |issue|
      Issue.update_or_create_from_json!(issue.attrs).tap do |i|
        issue.issuelinks.each do |link|
          i.create_links_from_json!(link.attrs)
        end
      end
    end
  end
end
