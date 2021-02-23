#      英語　数学
# 田中  80   66
# 佐藤  92   77
# 鈴木  40   95
# 広瀬  65   73

class Tester
  attr_reader :name,:english, :math
  def initialize(name,english,math)
    @name = name
    @english = english
    @math = math
  end
end

ary = ["田中 80 66", "佐藤 92 77", "鈴木 40 95", "広瀬 65 73"]
ary_testers = []
ary.each do |i|
  ary_testers << i.split()
end

testers = []
ary_testers.each do |i|
  testers << Tester.new(i[0],i[1],i[2])
end

# 英語と数学の最高点を求める
p testers.max_by { |tester| tester.english }.english
p testers.max_by { |tester| tester.math }.math
# 英語と数学の最高点者を求める
p testers.max_by { |tester| tester.english }.name
p testers.max_by { |tester| tester.math }.name
