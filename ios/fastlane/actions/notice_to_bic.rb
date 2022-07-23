module Fastlane
  module Actions
    class NoticeToBicAction < Action
      def self.run(params)
        UI.message "Post to Bein Community/App Notice"

        content = params[0]
        mention_user_ids = params[1]
        bot_id = params[2]
        group_ids = [742] # id of group [Staging] Bein Community/ App Notice
        UI.message "content: #{content}"
        UI.message "mention_user_ids: #{mention_user_ids}"
        UI.message "group_ids: #{group_ids}"

        response = Faraday.post "https://api.stg.bein.group/v1/stream/posts/bot" do |request|
          request.headers['Content-Type'] = 'application/json'
          request.headers['secret'] = '$2a$12$dvgazpG5VPUxPNQBQcIJUe2hZSorX816Wa6gKJMCcQKvk9BzQG66e'
#           request.headers['bot_id'] = "#{bot_id}"
          request.body = {"group_ids": group_ids, "content": content, "mention_user_ids": mention_user_ids}.to_json
        end
        p response.body

        UI.message "Notice done!"
      end

      def self.description
        "Notice when build success"
      end

      def self.details
        "Create a new post in group [Stg] Bein Community/App Notice"
      end

      def self.authors
        ["namanh"]
      end

      def self.is_supported?(platform)
        true
      end

    end
  end
end
