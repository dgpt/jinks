class Issue
  include Neo4j::ActiveNode
  include LinkMethods

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

  has_many :both, :dependent_links,
    rel_class: :DependentLink,
    model_class: self,
    unique: true

  has_many :both, :caused_links,
    rel_class: :CausedLink,
    model_class: self,
    unique: true

  has_many :both, :related_links,
    rel_class: :RelatesLink,
    model_class: self,
    unique: true

  # List of fields to request from Jira API
  # (keeps request size low)
  JIRA_FIELDS = %i[
    summary description
    issuetype issuelinks
    status priority
    customfield_10600
  ].freeze

  def self.update_or_create_from_json!(json = {})
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
end
