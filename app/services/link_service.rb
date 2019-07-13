require 'jira'

class LinkService
  def initialize(type)
    @type = type.to_s.capitalize
    @linkClass = "#{@type}Link".constantize
    @client = Jira.new.client
  end

  def create_link!(from:, to:)
    @client.Issuelink.build.save!({
      inwardIssue: {
        key: from.key
      },
      outwardIssue: {
        key: to.key
      },
      type: {
        name: @type
      }
    })

    # the issue link api doesn't return the created link id,
    # so we have to fetch it manually. We could pull the
    # issue id specifically here, but might as well
    # resync the data if we have to make a network request
    # either way...
    @client.Issue.find(from.key).issuelinks.each do |link|
      from.create_links_from_json!(link.attrs)
    end

    from.find_link(type: @type, to: to)
  end

  def destroy_link!(jira_id:)
    link = @linkClass.where(jira_id: jira_id).first
    @client.Issuelink.find(jira_id).delete
    link.destroy
    link
  end
end
