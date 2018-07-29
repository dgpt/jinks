Rails.application.routes.draw do
  resources :issues, only: %i[index]
end
