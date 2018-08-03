class Issue
  include Neo4j::ActiveNode

  property :jira_id
  property :key
  property :summary
  property :description
  property :type
  property :status
  property :priority
  property :epic
  property :assignee
  property :sprint_team
  property :sprint

  has_many :out,  :depends_on,        type: :DEPENDENT, model_class: self, unique: true
  has_many :in,   :is_depended_on_by, type: :DEPENDENT, model_class: self, unique: true

  has_many :out,  :causes,            type: :CAUSED,    model_class: self, unique: true
  has_many :in,   :caused_by,         type: :CAUSED,    model_class: self, unique: true

  has_many :both, :relates_to,        type: :RELATES,   model_class: self, unique: true

  # List of fields to request from Jira API
  # (keeps request size low)
  JIRA_FIELDS = %i[
    summary description
    issuetype issuelinks
    status priority
    customfield_10600
  ].freeze

  class << self
    def update_or_create_from_json!(json = {})
      find_or_initialize_by(jira_id: json["id"]).tap do |issue|
        issue.attributes = {
          key:          json["key"],
          summary:      json.dig("fields", "summary"),
          description:  json.dig("fields", "description"),
          type:         json.dig("fields", "issuetype", "name"),
          status:       json.dig("fields", "status",    "name"),
          priority:     json.dig("fields", "priority",  "name"),
          epic:         json.dig("fields", "customfield_10600"),
          assignee:     json.dig("fields", "assignee",  "displayName"),
          # TODO:
          #sprint_team:
          #sprint:
        }.compact

        issue.save! if issue.changed?
      end
    end

    def linked_nodes(type)
      all.query_as(:issue)
        .match("(issue)-[r:#{type}]-(other)")
        .pluck("DISTINCT issue")
    end

    def linked_rels(type)
      all.query_as(:issue)
        .match("(issue)-[r:#{type}]-(other)")
        .pluck("DISTINCT r")
    end
  end

  def create_links_from_json!(json = {})
    scopes = %w[ inward outward ].reduce({}) do |memo, type|
      rel = json.dig("type", type)&.gsub(' ', '_')
      memo[type] = rel if self.respond_to?(rel)
      memo
    end

    inward = json["inwardIssue"]
    outward = json["outwardIssue"]

    # TODO: this could be more performant
    send(scopes["inward"]) << (
      Issue.update_or_create_from_json!(inward)) if inward
    send(scopes["outward"]) << (
      Issue.update_or_create_from_json!(outward)) if outward
  end
end
