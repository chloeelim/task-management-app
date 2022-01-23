class AddDefaultValueToPriorityAttribute < ActiveRecord::Migration[6.0]
  def change
    change_column :tasks, :priority, :string, :default => "none"
  end
end
