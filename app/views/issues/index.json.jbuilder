#json.issues @issues, partial: 'issues/issue', as: :issue
#json.links @link_map if @link_map
json.nodes @nodes do |node|
  json.id "n#{node.neo_id}"
  json.label node.key
end

json.edges @edges do |edge|
  json.source "n#{edge.end_node_id}"
  json.target "n#{edge.start_node_id}"
  json.id "e#{edge.id}"
end
