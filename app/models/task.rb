class Task < ApplicationRecord
  belongs_to :subject, optional: true
  belongs_to :user

  validates :title, presence: true
  validates :completed, null: false, default: false
  
  VALID_PRIORITIES = ['important', 'flag', 'none', 'low']
  validates :priority, inclusion: { in: VALID_PRIORITIES }
end