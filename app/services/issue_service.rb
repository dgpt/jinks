require 'jira'

class IssueService
  attr_reader :jql

  def initialize(force_update: true)
    @client = Jira.new.client
    @force_update = force_update
    reset # sets initial instance variables
  end

  def reset
    @jql = []
    @to_sync = {
      epics: [],
      issues: [],
    }
  end

  def jql
    @jql.join(" ")
  end

  def and
    @jql << "AND"
    if block_given?
      group { yield }
    end
    self
  end

  def or
    @jql << "OR"
    if block_given?
      group { yield }
    end
    self
  end

  def group(&block)
    @jql << "("
    block.call
    @jql << ")"
    self
  end

  def epic(key)
    @jql << "\"Epic Link\" = #{key}"
    self
  end

  def issues(keys)
    @jql << "key in (#{Array(keys).join(", ")})"
    self
  end

  def set_sprint(sprint)
    #TODO
  end

  def load
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
