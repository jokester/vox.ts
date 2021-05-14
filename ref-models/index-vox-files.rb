#!/usr/bin/env ruby

require 'pathname'
require 'json'
require 'pp'

def main
  here = Pathname.new(__FILE__).parent
  Dir.chdir here

  File.open('vox-files.json', 'w') do |f|
    json_array = []

    Pathname.glob('**/*.vox').each do |vox|
      json_array << {
        path: vox.relative_path_from(here),
        size: vox.size,
      }
    end

    pp json_array
    f.write ({ files: json_array }).to_json

  end
end

main
