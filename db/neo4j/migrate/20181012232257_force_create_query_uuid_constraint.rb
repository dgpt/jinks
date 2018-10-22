class ForceCreateQueryUuidConstraint < Neo4j::Migrations::Base
  def up
    add_constraint :Query, :uuid, force: true
  end

  def down
    drop_constraint :Query, :uuid
  end
end
