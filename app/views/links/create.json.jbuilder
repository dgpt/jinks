json.edges @link do |edge|
  json.source edge&.from_node&.id
  json.target edge&.to_node&.id
  json.id edge&.jira_id
end
