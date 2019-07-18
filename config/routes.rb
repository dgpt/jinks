Rails.application.routes.draw do
  resources :issues, only: %i[index]
  resources :links, only: %i[create destroy]
end
