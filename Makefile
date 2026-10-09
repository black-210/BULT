# BULT — GNU Makefile
# Target: C> (C-Greater) Toolchain & ISO C11 Native Build
# Copyright (C) 2026 black-210 <https://github.com/black-210>
# License: GNU AGPL-3.0

CC ?= gcc
CFLAGS ?= -Wall -Wextra -pedantic -std=c11 -O2 -Iinclude
LDFLAGS ?= -lm

CGT ?= cgt
CGT_FLAGS ?= -O2

SRCS = src/core/core.c \
       src/rf/rf.c \
       src/red_team/red.c \
       src/blue_team/blue.c \
       src/purple_team/purple.c \
       src/physics/physics.c \
       src/chemistry/chemistry.c \
       src/forensics/forensics.c

OBJS = $(SRCS:.c=.o)

all: bin/bult bin/bult_test

bin:
	mkdir -p bin

bin/bult: $(OBJS) src/cli/main.c | bin
	$(CC) $(CFLAGS) -o $@ src/cli/main.c $(OBJS) $(LDFLAGS)

bin/bult_test: $(OBJS) tests/test_all.c | bin
	$(CC) $(CFLAGS) -o $@ tests/test_all.c $(OBJS) $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

test: bin/bult_test
	./bin/bult_test

clean:
	rm -rf $(OBJS) bin

# C> Native Pipeline targets (invokes cgt compiler from black-210/C-)
cgt-check:
	@which $(CGT) >/dev/null 2>&1 || (echo "Notice: C> compiler driver 'cgt' not found in PATH. Using C11 companion backend." && exit 0)
	$(CGT) --check-only src/core/bult_core.cgt
	$(CGT) --check-only src/rf/bult_rf.cgt
	$(CGT) --check-only src/intel/bult_intel.cgt
	$(CGT) --check-only src/red_team/bult_red.cgt
	$(CGT) --check-only src/blue_team/bult_blue.cgt
	$(CGT) --check-only src/purple_team/bult_purple.cgt
	$(CGT) --check-only src/physics/bult_physics.cgt
	$(CGT) --check-only src/chemistry/bult_chemistry.cgt
	$(CGT) --check-only src/forensics/bult_forensics.cgt
	$(CGT) --check-only src/cli/bult_cli.cgt

.PHONY: all test clean cgt-check
