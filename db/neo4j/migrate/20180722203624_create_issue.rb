class CreateIssue < Neo4j::Migrations::Base
  def up
    add_constraint :Issue, :uuid
  end

  def down
    drop_constraint :Issue, :uuid
  end
end
