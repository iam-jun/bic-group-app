module Fastlane
  module Actions
    class NoticeToBicAction < Action
      def self.run(params)
        UI.message "Send request notice to BIC Chat"

        webhook = params[0]
        title = params[1]
        version_text = params[2]
        download_destination = params[3]
        git_branch = params[4]
        git_mess = params[5]
        message = params[6]
        color = params[7]

        UI.message webhook
        UI.message title
        UI.message version_text
        UI.message download_destination
        UI.message git_branch
        UI.message git_mess
        UI.message message
        UI.message color

        response = Faraday.post webhook do |request|
          request.headers['Content-Type'] = 'application/json'
          request.body = {
            "attachments": [{
              "title": title,
              "color": color,
              "fields": [
              {
                "title": "Version",
                "value": version_text,
                "short": true
              },
              {
                "title": "Download at",
                "value": download_destination,
                "short": true
              },
              {
                "title": "Git Branch",
                "value": git_branch,
                "short": true
              },
              {
                "title": "Git Message",
                "value": git_mess,
                "short": false
              },
              {
                "title": "Message",
                "value": message,
                "short": false
              }
              ]
            }]
          }.to_json
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
