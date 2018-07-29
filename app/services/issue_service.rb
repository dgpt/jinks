require 'jira'

class IssueService
  def initialize
    @client = Jira.new.client
  end

  def load_epic(key)
    load_jql "\"Epic Link\" = #{key}"
  end

  def load_issues(keys)
    load_jql "key in (#{Array(keys).join(", ")})"
  end

  def load_sprint(sprint)
    #TODO
  end

  def load_jql(jql)
    issues = @client.Issue.jql(
      jql,
      fields: Issue::JIRA_FIELDS,
      max_results: 300
    )

    issues.each do |issue|
      Issue.update_or_create_from_json!(issue.attrs).tap do |i|
        issue.issuelinks.each do |link|
          i.create_links_from_json!(link.attrs)
        end
      end
    end
  end
end
