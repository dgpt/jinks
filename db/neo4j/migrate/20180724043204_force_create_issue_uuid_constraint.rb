class ForceCreateIssueUuidConstraint < Neo4j::Migrations::Base
  def up
    add_constraint :Issue, :uuid, force: true
  end

  def down
    drop_constraint :Issue, :uuid
  end
end
