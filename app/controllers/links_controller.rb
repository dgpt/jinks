class LinksController < ApplicationController
  # POST /links
  #
  # Creates issue links
  #
  # Request Parameters
  #   source - String; Jira key of the inward issue
  #   target - String; Jira key of the outward issue
  #   type   - String; type of relationship to make
  #            See Issue's has_many relationships for supported types
  #
  #   (source)-[type]->target
  def create
    @links = create_params[:links].map do |link_param|
      from = Issue.find_by!(key: link_param[:from])
      to = Issue.find_by!(key: link_param[:to])
      link_service.create_link!(from: from, to: to)
    end
  end

  # DELETE /links/:id
  #
  # Removes issue links
  #
  # Request Parameters
  #   type - String; type of relationship to delete
  def destroy
    link_service.destroy_link!(jira_id: params[:id])
    head 204
  end

  private
  def link_service
    @link_service ||= LinkService.new(params[:type])
  end

  def create_params
    params.require(links: [ :from, :to ])
  end
end
