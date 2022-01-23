class Event < ApplicationRecord
  belongs_to :subject, optional: true
end
