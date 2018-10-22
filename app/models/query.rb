class Query
  include Neo4j::ActiveNode

  property :jql

  has_many :out, :issues, type: :QUERIED, model_class: :Issue
end
