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
    from = Issue.find_by!(key: params[:from])
    to = Issue.find_by!(key: params[:to])
    link_service.create_link!(from: from, to: to)
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

  # TODO: support array of links for params
  #def create_params
  #  params.require(links: [ :from, :to ])
  #end
end
