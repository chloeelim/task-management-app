class CreateSubjects < ActiveRecord::Migration[6.0]
  def change
    create_table :subjects do |t|
      t.string :title
      t.text :description
      t.string :color
      t.string :important_dates
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
