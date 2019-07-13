module LinkMethods
  LinkError = Class.new(StandardError)
  InvalidLinkError = Class.new(LinkError)
  NoLinkContextProvided = Class.new(LinkError)

  def create_links_from_json!(json = {})
    inward_json = json["inwardIssue"]
    outward_json = json["outwardIssue"]

    linkType = json.dig("type", "name")
    baseAttrs = {
      type: linkType,
      jira_id: json["id"]
    }

    if inward_json.present?
      issue = Issue.update_or_create_from_json!(inward_json)
      create_link!(baseAttrs.merge({ from: issue }))
    end

    if outward_json.present?
      issue = Issue.update_or_create_from_json!(outward_json)
      create_link!(baseAttrs.merge({ to: issue }))
    end
  end

  def create_link!(type:, from: nil, to: nil, **attrs)
    assert_presence from, to

    link_class(type).create!(
      attrs.merge(
        rel_attrs(from: from, to: to)
      )
    )
  end

  def find_link(type:, from: nil, to: nil)
    assert_presence from, to
    node = to || from
    position = to.present? ? :to : :from
    node.query_as(position).match(<<-CY).pluck(:rel).first
      (from)-[rel:#{type.to_s.upcase}]->(to)
    CY
  end

  private

  def assert_presence(*args)
    raise NoLinkContextProvided unless args.any? &:present?
  end

  def link_class(type)
    "#{type.to_s}Link".constantize
  rescue NameError
    raise InvalidLinkError, "Invalid type of '#{type}'"
  end

  def rel_attrs(from: nil, to: nil)
    if to.present?
      {
        to_node: to,
        from_node: self
      }
    else
      {
        to_node: self,
        from_node: from
      }
    end
  end
end
