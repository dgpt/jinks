class Query
  include Neo4j::ActiveNode

  property :jql

  has_many :out, :issues, type: :QUERIED, model_class: :Issue

  def linked_rels(type)
    query_as(:q)
      .match("(i:Issue)-[r:#{type}]-(other:Issue)")
      .where("exists((q:Query)-[:QUERIED]->(other:Issue))")
      .where("exists((q:Query)-[:QUERIED]->(i:Issue))")
      .pluck("DISTINCT r")
  end
end
