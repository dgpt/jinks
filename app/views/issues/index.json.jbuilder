json.nodes @issues do |node|
  json.id "n#{node.neo_id}"
  json.label node.key
  json.summary node.summary
  json.description node.description
  json.type node.type
  json.priority node.priority
  json.status node.status
end

json.edges @rels do |edge|
  json.source "n#{edge.end_node_id}"
  json.target "n#{edge.start_node_id}"
  json.id "e#{edge.id}"
end
