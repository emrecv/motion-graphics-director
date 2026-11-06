#!/usr/bin/env python3
"""Copy this skill's clean, locked Remotion starter into a new project."""

from __future__ import annotations

import argparse
from pathlib import Path
import shutil
import sys


def copy_starter(source: Path, destination: Path) -> None:
    if not (source / "package.json").is_file():
        raise ValueError(f"Starter package is missing: {source / 'package.json'}")
    if destination.exists():
        raise ValueError(f"Destination already exists; choose a new directory: {destination}")
    if source == destination or source in destination.parents:
        raise ValueError("Destination must be outside the bundled starter.")
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(
        source,
        destination,
        ignore=shutil.ignore_patterns("node_modules", ".git", ".DS_Store", ".cache", "renders", "dist", "__pycache__"),
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("destination", help="A new directory for the project")
    arguments = parser.parse_args()
    source = Path(__file__).resolve().parents[1] / "assets" / "starter"
    destination = Path(arguments.destination).expanduser().resolve()
    try:
        copy_starter(source, destination)
    except (OSError, ValueError) as error:
        print(f"Could not create project: {error}", file=sys.stderr)
        return 1
    print(f"Created project: {destination}")
    print("Next: run npm ci in that directory, then npm run studio.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
