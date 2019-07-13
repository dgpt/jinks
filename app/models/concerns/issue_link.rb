module IssueLink
  def self.included(base)
    base.instance_eval do
      include Neo4j::ActiveRel

      from_class :Issue
      to_class :Issue

      creates_unique :all

      property :jira_id, type: String
      validates_presence_of :jira_id
    end
  end
end
