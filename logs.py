import math

class Log:
	def __init__(self, file):
		self.file = file
		
		self.logs = []
		self.read_logs()
		
		self.moves = []
		self.move_counts = {}
		self.read_moves()
		self.count_moves()
		
		self.wins = []
		self.win_counts = {}
		self.read_wins()
		self.count_wins()
		
		self.averages = {}
		self.CI = {}
		self.average_wins()
		self.set_CI()
	
	def read_logs(self):
		f = open(self.file)
		self.logs = [[value.strip() for value in line.split(',')] for line in f.readlines()]
		f.close()
		return self.logs
	
	def read_moves(self):
		mi = self.logs[0].index('Move History') # Move index
		self.moves = [[game[mi][i:i+3] for i in range(0, len(game[mi]), 3)] for game in self.logs[1:]]
		return self.moves

	def read_wins(self):
		wi = self.logs[0].index('Winner') # Win index
		self.wins = [game[wi] for game in self.logs[1:]]
		return self.wins
	
	def count_moves(self):
		for i, game in enumerate(self.moves):
			for move in game:
				p = move[1:]
				if p in self.move_counts:
					self.move_counts[p] += 1
				else:
					self.move_counts[p] = 1
		return self.move_counts

	def count_wins(self):
		for i, game in enumerate(self.moves):
			winner = self.wins[i]
			for move in game:
				p = move[1:]
				if winner == 'T':
					if p in self.win_counts:
						self.win_counts[p] += 0.5
					else:
						self.win_counts[p] = 0.5
				elif move[0] == winner:
					if p in self.win_counts:
						self.win_counts[p] += 1.0
					else:
						self.win_counts[p] = 1.0
		return self.win_counts
				
		return self.win_counts
	
	def average_wins(self):
		for key in self.move_counts.keys():
			if key in self.win_counts:
				self.averages[key] = round(self.win_counts[key] / self.move_counts[key], 3)
			else:
				self.averages[key] = 0.0
		return self.averages
		
	def set_CI(self, z = 1.96):
		for key in self.averages.keys():
			p = self.averages[key]
			n = self.move_counts[key]
			se = math.sqrt(p * (1 - p) / n)
			self.CI[key] = [round(p - z * se, 3), round(p + z * se, 3)]
		return self.CI

	def merge_logs(self, input, output):
		f1 = open(self.file)
		f2 = open(input)
		f3 = open(output, 'a+')
		
		f3.writelines(f1.readlines())
		f3.write('\n')
		f3.writelines(f2.readlines()[1:])	
		
		f1.close()
		f2.close()
		f3.close()
		
	def write_to_file(self, value, output):
		f = open(output, 'w+')
		f.write(str(value)
		f.close()
		