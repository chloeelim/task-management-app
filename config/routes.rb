Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'welcome#index'
  post '/login', to: 'sessions#create'
  post '/new_task', to: 'tasks#create'
  post '/new_subject', to: 'subjects#create'
  post '/new_event', to: 'events#create'
  delete '/logout', to: 'sessions#destroy'
  delete '/delete_task/:task_id', to: 'tasks#delete'
  delete '/delete_subject/:subject_id', to: 'subjects#delete'
  delete '/delete_event/:event_id', to: 'events#delete'
  patch '/update_task/:task_id', to: 'tasks#update'
  patch '/new_subject/:subject_id', to: 'subjects#update'
  patch '/new_event/:event_id', to: 'events#update'
  get '/logged_in', to: 'sessions#is_logged_in?'
  get '/user_data', to: 'tasks#user_data'
  get '/dashboard/tasks/:task_id', to: 'tasks#show'
  get '/dashboard/subjects/:subject_id', to: 'subjects#show'
  get '/dashboard/events/:event_id', to: 'events#show'
  get '/*path' => 'welcome#index'
  
  resources :users, only: [:create]
  # creates the routes:
  # post '/users', to: 'users#create'
  # get '/users/:user_id', to: 'users#show'
  # get '/users', to: 'users#index'
end
