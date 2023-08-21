module Fastlane
  module Actions
    class NoticeBuildTaskWebhookAction < Action
      def self.run(params)
        UI.message "Send request notice to build task webhook"

        webhook = params[0]
        status = params[1]
        buildName = params[2]
        buildLink = params[3]
        messages = params[4]

        UI.message webhook
        UI.message status
        UI.message buildName
        UI.message buildLink
        UI.message messages

        response = Faraday.post webhook do |request|
          request.headers['Content-Type'] = 'application/json'
          request.body = {
            "status": status,
            "buildName": buildName,
            "buildLink": buildLink,
            "messages": messages
          }.to_json
        end
        p response.body

        UI.message "Notice done!"
      end

      def self.description
        "Notice to build task webhook build success"
      end

      def self.details
        "Send to request to backend's webhook for auto change task status on Click Up, notice new build in UC"
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
