json.nodes @issues do |node|
  json.id node.id
  json.label node.key
  json.summary node.summary
  json.description node.description
  json.type node.type
  json.priority node.priority
  json.status node.status
end

json.edges @rels do |edge|
  json.source edge.from_node.id
  json.target edge.to_node.id
  json.id edge.jira_id
end
